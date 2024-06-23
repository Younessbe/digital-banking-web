import { Component,OnInit } from '@angular/core';
import {CustomerService} from "../services/customer.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {catchError, throwError} from "rxjs";
import {Customer} from "../model/customer.model";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit{
  customers!: any;
  errorMessage! : string ;
  searchFormGroup! : FormGroup;
  constructor(private customersService:CustomerService, private fb:FormBuilder) {
  }
  ngOnInit() {
    this.searchFormGroup=this.fb.group({
      keyword : this.fb.control("")
    })
  this.customersService.getCustomers().subscribe({
    next: value => {
      this.customers=value;
    }
  });
    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
   let kw = this.searchFormGroup.value.keyword;
   this.customers=this.customersService.searchCustomers(kw).pipe(
     catchError(err => {
       this.errorMessage=err.message;
       return throwError(err);
     })
   );
  }

  handleDeleteCustomer(c: Customer) {
    this.customersService.deleteCustomer(c.id).subscribe({
      next :(resp) => {
        this.handleSearchCustomers();
      },
      error:err=>{
        console.log(err);
      }
    })

  }
}


