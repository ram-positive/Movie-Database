/**
 * @author Ramjilal choudhary
 * @date 29/12/2021
 * @description - Contrller class for Movies DB component
 */
public with sharing class MoviesDBController {

    /**
     * @author Ramjilal Choudharu
     * @date 29/12/2021
     * @description - method to get Movies records with filters
     * @param filterBy - filter by value
     * @param searchValue - search value
     * @return MoviesDBWrapper - list of movies records
     */
    @AuraEnabled
    public static MoviesDBWrapper getMoviesList(String filterBy, String searchValue) {
        MoviesDBWrapper movieDBWrpr = new MoviesDBWrapper();
        try{
            filterBy = (String)JSON.deserialize(
                                filterBy, String.class);
            searchValue = (String)JSON.deserialize(
                                searchValue, String.class);
            String search = '\'' + searchValue + '%\'';
            String whereClause = ' WHERE ' + filterBy + ' LIKE ' + search;
            String movieQuery = 'SELECT Id, ' + ConstantClass.movieFields
                                + ' FROM Movies__c ' + whereClause 
                                + ' ORDER BY Name ASC';
            List<Movies__c> listOfMovies = Database.query(movieQuery);
            List<MovieWrapper> listOfMovieWrapper = new List<MovieWrapper>();
            for(Movies__c movie : listOfMovies) {
                listOfMovieWrapper.add(
                    new MovieWrapper(
                        movie.Name,
                        movie.Genre__c,
                        movie.Rating__c,
                        movie.Year__c
                    )
                );
            }
            movieDBWrpr.listOfMovieWrapper = listOfMovieWrapper;
        } catch(Exception exp) {
            System.debug('The following exception has occurred: ' + exp.getMessage());
            throw new MoviesDBException(exp.getLineNumber() + '---' + exp.getMessage());
        }
        return movieDBWrpr;
    }

    /**
     * Wrapper class for Movie data
     */
    public class MovieWrapper {
        @AuraEnabled
        public String moviesName{get; set;}
        @AuraEnabled
        public String genre{get; set;}
        @AuraEnabled
        public String rating{get; set;}
        @AuraEnabled
        public String year{get; set;}

        public MovieWrapper(String moviesName, String genre, String rating, String year) {
            this.moviesName = moviesName;
            this.genre = genre;
            this.rating = rating;
            this.year = year;
        }
    }
    
    /**
     * Wrapper class for list of Movies
     */
    public class MoviesDBWrapper {
        @AuraEnabled
        public List<MovieWrapper> listOfMovieWrapper{get; set;}
    }

    /**
     * Custom Exception class
     */
    public class MoviesDBException extends Exception{}
}