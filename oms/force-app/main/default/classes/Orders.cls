public with sharing class Orders {
    @AuraEnabled(cacheable = true)
    public static List<Order> getAllOrders(){
        List<Order> li = [SELECT Name,OrderNumber,Status FROM Order];
        return li;
    }

    @AuraEnabled(cacheable = true)
    public static List<Product2> getProducts(String searchKey_name,String searchKey_brand){
       // String sea = searchName.toLowerCase();
       String key_name = '%' + searchKey_name + '%';
       String key_brand = '%'+ searchKey_brand + '%';
        List<Product2> li = [SELECT Brand__c,Name,Stock_Quantity__c,ProductCode FROM Product2 WHERE Name LIKE :key_name AND Brand__c LIKE :key_brand];
        if(li.size()==0)
        {
            return [SELECT Brand__c,Name,Stock_Quantity__c,ProductCode FROM Product2 WHERE Name LIKE :key_name];
        }
        return li;
    }

    @AuraEnabled(cacheable = true)
    public static List<PricebookEntry> getUnitPrice(Id searchId){
       // String sea = searchName.toLowerCase();
    //    String key_name = '%' + searchKey_name + '%';
    //    String key_brand = '%'+ searchKey_brand + '%';
        Id prid = '01s2w000004mHGDAA2' ;
        List<PricebookEntry> li = [select Id,UnitPrice from PricebookEntry WHERE Product2Id =:searchId AND Pricebook2Id=:prid];
        return li;
    }

    @AuraEnabled(cacheable = true)
    public static List<OrderItem> getRelatedOrderItem(Id ordId){
       // String sea = searchName.toLowerCase();
    //    String key_name = '%' + searchKey_name + '%';
    //    String key_brand = '%'+ searchKey_brand + '%';
        List<OrderItem> li = [select Product_Name__c,Product_Code__c,Product_Brand__c,Quantity,UnitPrice,TotalPrice,orderId from orderitem where orderId=:ordId];
        return li;
    }

}
