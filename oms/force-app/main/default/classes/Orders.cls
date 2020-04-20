public with sharing class Orders {
    @AuraEnabled(cacheable = true)
    public static List<Order> getAllOrders(){
        List<Order> li = [SELECT Name,OrderNumber,Status FROM Order];
        return li;
    }

    @AuraEnabled(cacheable = true)
    public static List<Product2> getProducts(String searchName){
       // String sea = searchName.toLowerCase();
        List<Product2> li = [SELECT Brand__c,Name FROM Product2 WHERE Name = : searchName];
        return li;
    }

}
