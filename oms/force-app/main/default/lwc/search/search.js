import { LightningElement, wire, api } from 'lwc';
import getProducts from '@salesforce/apex/Orders.getProducts';
import getUnitPrice from '@salesforce/apex/Orders.getUnitPrice';
import getRelatedOrderItem from '@salesforce/apex/Orders.getRelatedOrderItem';
const DELAY = 300;
export default class Search extends LightningElement {

    @api searchKey_name = "";
    @api searchKey_brand = "";
    @api product_id;
    @api unitprice;
    @api pricebookentryid;
    @api currentOrderId;


    products;
    relatedOrderItems;
    isshow = false;
    isShowAdd = false;
    isShowSearchComponent = true;
    isShowFinalOrder = false;
    


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
    }

    handleContinue(event)
    {
        console.log("isShowSearchComponent");
        this.handleContinueHelper();
        this.isShowSearchComponent = false;
        this.isShowFinalOrder = true;
        
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
        console.log("Product Id : "+event.target.value);
        this.product_id = event.target.value;
        getUnitPrice({'searchId':event.target.value}).then(result=> {
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

    handleSuccess(event)
    {
        const updatedRecord = event.detail.id;
        console.log('onsuccess: ', updatedRecord); 
        this.isShowAdd = false;
    }

    handleError(event) {
        console.log("handleError event");
        console.log(JSON.stringify(event.detail));
    }

    handleClose(event)
    {
        this.isShowAdd = false;
    }

}