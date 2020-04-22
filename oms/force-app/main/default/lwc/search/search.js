import { LightningElement, wire, api } from 'lwc';
import getProducts from '@salesforce/apex/Orders.getProducts'
const DELAY = 300;
export default class Search extends LightningElement {

    @api searchKey_name = "";
    @api searchKey_brand = "";
    products;
    isshow = false;
    @wire(getProducts,{searchKey_name:'$searchKey_name',searchKey_brand:'$searchKey_brand'})
    wiredContacts({ error, data }) {
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
}