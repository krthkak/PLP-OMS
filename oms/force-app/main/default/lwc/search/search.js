import { LightningElement, wire } from 'lwc';
import getProducts from '@salesforce/apex/Orders.getProducts'
const DELAY = 300;
export default class Search extends LightningElement {

    searchKey_name = "";
    products;
    isshow = false;
    @wire(getProducts,{searchName:'$searchKey_name'})
    wiredContacts({ error, data }) {
        if (data) {
            this.products = data;
            this.error = undefined;
            console.log(data);
        } else if (error) {
            this.error = error;
            this.products = undefined;
            console.log("not working");
        }
    }
    

    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey_name = event.target.value;
        console.log(searchKey_name);
        this.delayTimeout = setTimeout(() => {
            this.searchKey_name = searchKey_name;
        }, DELAY);
        this.isshow=true;
    }
}