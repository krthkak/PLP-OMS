import { LightningElement, api } from 'lwc';

export default class EditOverride extends LightningElement {
    @api recordId;

    handleSubmit(event) {
        console.log('onsubmit: '+ event.detail.fields);
 
    }
    
    handleError(event) {
        console.log("handleError event");
        console.log(JSON.stringify(event.detail));
    }

    handleSuccess(event) {
        const updatedRecord = event.detail.id;
        console.log('onsuccess: ', updatedRecord);
        location.reload();
    }
}