import { LightningElement, wire, api } from 'lwc';
import getProducts from '@salesforce/apex/Orders.getProducts';
import getUnitPrice from '@salesforce/apex/Orders.getUnitPrice';
import getRelatedOrderItem from '@salesforce/apex/Orders.getRelatedOrderItem';
import getOrderDetails from '@salesforce/apex/Orders.getOrderDetail';
import deleteRelatedOrderItem from '@salesforce/apex/Orders.deleteRelatedOrderItem';
import updOrd from '@salesforce/apex/Orders.updateOrder';
import { deleteRecord } from 'lightning/uiRecordApi';
const DELAY = 300;
export default class Search extends LightningElement {

    @api searchKey_name = "";
    @api searchKey_brand = "";
    @api product_id;
    @api unitprice;
    @api pricebookentryid;
    @api currentOrderId = null;
    @api updateOrderItem;


    products;
    @api relatedOrderItems;
    @api orderDetails = {"OrderNumber":"no data","TotalAmount":"NO data"};
    isshow = false;
    isShowAdd = false;
    isShowSearchComponent = true;
    isShowFinalOrder = false;
    isOrderItemUpdate = false;
    


    @wire(getProducts,{searchKey_name:'$searchKey_name',searchKey_brand:'$searchKey_brand'})
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            this.error = undefined;
            console.log("hi");
            console.log(JSON.stringify(data));
            this.isshow=false;
            this.isshow=true;
        } else if (error) {
            this.error = error;
            this.products = undefined;
            console.log("not working");
        }
    }

    // @wire(getRelatedOrderItem,{ordId:'$currentOrderId'})
    // wiredRelatedOrderItem({ error, data }) {
    //     if (data) {
    //         this.relatedOrderItems = data;
    //         this.error = undefined;
    //         console.log("from related order items");
    //         console.log(JSON.stringify(data));
    //         this.isshow=false;
    //         this.isshow=true;
    //     } else if (error) {
    //         this.error = error;
    //         this.relatedOrderItems = undefined;
    //         console.log("not working");
    //     }
    // } 
    
    saveOrderId(event)
    {
        this.currentOrderId = event.target.value;
    }

    handleContinueHelper()
    {
        getRelatedOrderItem({ordId:this.currentOrderId}).then(
            result=>{
                console.log("result received");
                console.log(JSON.stringify(result));
                this.relatedOrderItems = JSON.parse(JSON.stringify(result));
            }
        ).catch(error => {
            // display server exception in toast msg 
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
            // reset contacts var with null   
           // this.order = null;
        });

        getOrderDetails({ordId:this.currentOrderId}).then(
            result=>{
                console.log("result received for order details");
                console.log(JSON.stringify(result));
                this.orderDetails = JSON.parse(JSON.stringify(result))[0];
                console.log("order details");
                console.log(this.orderDetails);
            }
        ).catch(error => {
            // display server exception in toast msg 
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
            // reset contacts var with null   
           // this.order = null;
        });
    }

    handleContinue(event)
    {
        console.log("isShowSearchComponent");
        if(this.currentOrderId!=null)
        {
            this.handleContinueHelper();
            this.isShowSearchComponent = false;
            this.isShowFinalOrder = true;
        }
        else alert("Select a product with Order to continue");

    }

    handleKeyNameChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey_name = event.target.value;
        console.log("Name => "+searchKey_name);
        this.delayTimeout = setTimeout(() => {
            this.searchKey_name = searchKey_name;
        }, DELAY);
    
    }

    handleKeyBrandChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey_brand = event.target.value;
        console.log("Brand => "+searchKey_brand);
        this.delayTimeout = setTimeout(() => {
            this.searchKey_brand = searchKey_brand;
        }, DELAY);
    
    }

    handleAdd(event)
    {
        if(this.currentOrderId==null || this.currentOrderId == '')
        {
            alert("Please select Order to continue");
        }
        else{
        console.log("Product Id : "+event.target.value);
        this.product_id = event.target.value;
        getUnitPrice({'searchId':event.target.value,'ordId':this.currentOrderId}).then(result=> {
            console.log(JSON.stringify(result))
            this.unitprice = result[0].UnitPrice;
            this.pricebookentryid = result[0].Id;
            console.log(this.unitprice);
        }).catch(error => {
            // display server exception in toast msg 
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
            // reset contacts var with null   
           // this.order = null;
        });
        this.isShowAdd = true;
    }
    }

    handleRemove(event)
    {
        deleteRecord(event.target.value).then(
            result=>{
                console.log(result);
                this.handleContinueHelper();
                alert("Deleted succesfully");
                
            }
        ).catch(error => {
            // display server exception in toast msg 
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
            // reset contacts var with null   
           // this.order = null;
        });
       // this.handleContinueHelper();
      
    }

    handleSuccess(event)
    {
        const updatedRecord = event.detail.id;
        console.log('onsuccess: ', updatedRecord); 
        this.isShowAdd = false;
        alert("Product added Successfully");
    }

    handleError(event) {
        console.log("handleError event");
        console.log(JSON.stringify(event.detail));
    }

    handleClose(event)
    {
        this.isShowAdd = false;
    }

    handleCancelOrder(event)
    {
        location.reload();
    }

    handleConfirmOrder(event)
    {
        updOrd({ordId:this.currentOrderId}).then(
            result=>{
                console.log("result received for update");
                console.log(result);
                if(result == 'approval')
                {
                    alert("The Order is requested for approval");
                    location.reload();
                }
                else if(result=='confirmed')
                {
                    alert("The Order is confirmed");
                    location.reload();
                }
            }
        ).catch(error => {
            // display server exception in toast msg 
        //     const event = new ShowToastEvent({
        //         title: 'Error',
        //         variant: 'error',
        //         message: error.body.message,
        //     });
        //     this.dispatchEvent(event);
        //     // reset contacts var with null   
        //    // this.order = null;
        console.log(JSON.stringify(error));
        });
 
    }


    //All update stuff

    handleUpdate(event)
    {
        this.updateOrderItem = event.target.value;
        this.isOrderItemUpdate = true;
    }

    handleUpdateSuccess(event)
    {
        const updatedRecord = event.detail.id;
        console.log('onsuccess: ', updatedRecord); 
        this.isOrderItemUpdate = false;
        alert("Product updated Successfully");
        this.handleContinueHelper();
    }

    handleUpdateError(event) {
        console.log("handleError event");
        console.log(JSON.stringify(event.detail));
    }

    handleUpdateClose()
    {
        this.isOrderItemUpdate = false;
    }

}