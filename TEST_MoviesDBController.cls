/**
 * @author Ramjilal choudhary
 * @date 29/12/2021
 * @description - Test class for MoviesDBController
 */
@isTest
public with sharing class TEST_MoviesDBController {
    @TestSetup
    static void makeData(){
        Movies__c movie = new Movies__c();
        movie.Name = 'test-1';
        movie.Genre__c = 'War';
        movie.Rating__c = '9';
        movie.Year__c = '2022';
        INSERT movie;

        Movies__c movie2 = new Movies__c();
        movie2.Name = 'test-2';
        movie2.Genre__c = 'Drama';
        movie2.Rating__c = '5';
        movie2.Year__c = '2021';
        INSERT movie2;
    }

    @isTest
    static void testGetMoviesList() {
        MoviesDBController.MoviesDBWrapper movieDBWrpr = 
                MoviesDBController.getMoviesList(JSON.serialize('Name'), JSON.serialize('t'));
        System.assert(!movieDBWrpr.listOfMovieWrapper.isEmpty());

        movieDBWrpr = MoviesDBController.getMoviesList(JSON.serialize('Name'), JSON.serialize('yd'));
        System.assert(movieDBWrpr.listOfMovieWrapper.isEmpty());
    }

    @isTest
    static void testGetMoviesListWithException() {
        try{
            MoviesDBController.MoviesDBWrapper movieDBWrpr = 
                MoviesDBController.getMoviesList('Name', JSON.serialize('t'));
            System.assert(!movieDBWrpr.listOfMovieWrapper.isEmpty());
        } catch(Exception exp) {
            System.assert(exp != NULL);
        }
    }
}
