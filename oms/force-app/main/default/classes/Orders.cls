public with sharing class Orders {
    @AuraEnabled()
    public static List<Order> getOrderDetail(Id ordId){
        List<Order> li = [select Id,TotalAmount,OrderNumber,Name,Total_Quantity__c from Order WHERE Id=:ordId];
        return li;
    }

    @AuraEnabled(cacheable = true)
    public static List<Product2> getProducts(String searchKey_name,String searchKey_brand){
       // String sea = searchName.toLowerCase();
       String key_name = '%' + searchKey_name + '%';
       String key_brand = '%'+ searchKey_brand + '%';
       Integer zero = 0;
        List<Product2> li = [SELECT Brand__c,Name,Stock_Quantity__c,ProductCode FROM Product2 WHERE Name LIKE :key_name AND Brand__c LIKE :key_brand AND Stock_Quantity__c !=:zero];
        if(li.size()==0)
        {
            return [SELECT Brand__c,Name,Stock_Quantity__c,ProductCode FROM Product2 WHERE Name LIKE :key_name AND Stock_Quantity__c !=:zero];
        }
        return li;
    }

    @AuraEnabled(cacheable = true)
    public static List<PricebookEntry> getUnitPrice(Id searchId,Id ordId){
       // String sea = searchName.toLowerCase();
    //    String key_name = '%' + searchKey_name + '%';
    //    String key_brand = '%'+ searchKey_brand + '%';
        List<Order> l = [select Pricebook2Id from Order WHERE Id=:ordId];
        Id prid =  l[0].Pricebook2Id;
        List<PricebookEntry> li = [select Id,UnitPrice from PricebookEntry WHERE Product2Id =:searchId AND Pricebook2Id=:prid];
        return li;
    }

    @AuraEnabled()
    public static List<OrderItem> getRelatedOrderItem(Id ordId){
       // String sea = searchName.toLowerCase();
    //    String key_name = '%' + searchKey_name + '%';
    //    String key_brand = '%'+ searchKey_brand + '%';
        List<OrderItem> li = [select Product_Name__c,Product_Code__c,Product_Brand__c,Quantity,UnitPrice,TotalPrice,orderId from orderitem where orderId=:ordId];
        return li;
    }

    //NOt being used
    @AuraEnabled()
    public static void deleteRelatedOrderItem(Id ordId){

        List<OrderItem> li = [select orderId from orderitem where orderId=:ordId];
        try {
            delete li;
        } catch (Exception e) {
           // return e.getMessage();
        }
    }

    @AuraEnabled()
    public static String updateOrder(Id ordId){
        List<Order> li = [select Id,TotalAmount,OrderNumber,Status,approval__c from Order WHERE Id=:ordId];
        if(li[0].TotalAmount > 100000)
        {
            
            li[0].approval__c = 'yes';
            update li[0];
            return 'approval';
        }
        else 
            {
                li[0].Status = 'In process';
                update li[0];
                return 'confirmed';
            }
        
    }

}
