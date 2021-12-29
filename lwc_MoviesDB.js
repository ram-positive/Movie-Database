import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Movies__c.Name';
import GENRE_FIELD from '@salesforce/schema/Movies__c.Genre__c';
import RATING_FIELD from '@salesforce/schema/Movies__c.Rating__c';
import YEAR_FIELD from '@salesforce/schema/Movies__c.Year__c';

import getMoviesList from '@salesforce/apex/MoviesDBController.getMoviesList';

import Movies_DB_Title from '@salesforce/label/c.Movies_DB_Title';
import Movies_DB_Insertion_Success_Title from '@salesforce/label/c.Movies_DB_Insertion_Success_Title';
import Movies_DB_Insertion_Success_Message from '@salesforce/label/c.Movies_DB_Insertion_Success_Message';
import Movies_DB_Header_Label from '@salesforce/label/c.Movies_DB_Header_Label';
import Add_Movie_to_DB_Button_Label from '@salesforce/label/c.Add_Movie_to_DB_Button_Label';
import Filters_By_Selection_Label from '@salesforce/label/c.Filters_By_Selection_Label';
import No_records_found_error_message from '@salesforce/label/c.No_records_found_error_message'

export default class Lwc_MoviesDB extends LightningElement {

    objectApiName = "Movies__c";
    moviesDBRecods = [];
    defaultFilterValue = 'Name';
    selectedFilterValue;

    fields = {
        NAME_FIELD,
        GENRE_FIELD,
        RATING_FIELD,
        YEAR_FIELD
    };

    filterOptions = [
        {label : 'Movies Name', value : 'Name'},
        {label : 'Movies Genre', value : 'Genre__c'},
        {label : 'Movies Rating', value : 'Rating__c'},
        {label : 'Movies Year', value : 'Year__c'},
    ]

    label = {
        Movies_DB_Title,
        Movies_DB_Insertion_Success_Title,
        Movies_DB_Insertion_Success_Message,
        Movies_DB_Header_Label,
        Add_Movie_to_DB_Button_Label,
        Filters_By_Selection_Label,
        No_records_found_error_message
    };

    columns = [
        { label: 'Movies Name', fieldName: 'moviesName'},
        { label: 'Genre', fieldName: 'genre'},
        { label: 'Rating', fieldName: 'rating'},
        { label: 'Year', fieldName: 'year'}
    ];

    get recordsPresent() {
        if(this.moviesDBRecods !== undefined &&
            this.moviesDBRecods.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    connectedCallback() {
        this.getMoviesList(this.defaultFilterValue, '');
    }
    
    getMoviesList(filterValue, searchValue) {
        getMoviesList({filterBy : JSON.stringify(filterValue), searchValue : JSON.stringify(searchValue)})
            .then((result) => {
                this.moviesDBRecods = result.listOfMovieWrapper;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getFilteredMoviesList() {

    }

    handleFilterSelect(event) {
        this.selectedFilterValue = event.currentTarget.value;
    }

    handleSearch(event) {
        let searchValue = event.currentTarget.value;
        let filterValue = this.defaultFilterValue;
        if(this.selectedFilterValue !== undefined) {
            filterValue = this.selectedFilterValue;
        }
        this.getMoviesList(filterValue, searchValue);
    }

    handleSubmit(event){
        event.preventDefault(); 
        let fields = event.detail.fields;
        let result = this.formValidation(fields);
        if(result) {
            this.template.querySelector('lightning-record-edit-form').submit(fields);
        } else {
            this.showNotification('Error', 
                'Input is Wrong',
                'Error');
        }
     }

    handleSuccess() {
        this.handleReset();
        this.showNotification(this.label.Movies_DB_Insertion_Success_Title, 
                            this.label.Movies_DB_Insertion_Success_Message,
                            'Success');
        this.getMoviesList(this.defaultFilterValue, '');
    }

    handleReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

    formValidation(fields) {
        var rating = parseInt(fields.Rating__c);
        var year = parseInt(fields.Year__c);
        if(rating > 10) {
            return false
        }
        if(1950 < year && year > 9999) {
            return false;
        }
        return true;
    }

    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}