import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../../services/form.service';
import {Country} from '../../common/country';
import {State} from '../../common/state';
import {CustomValidators} from '../../validators/customValidators';
import {CartService} from '../../services/cart.service';
import {CheckoutService} from '../../services/checkout.service';
import {Router} from '@angular/router';
import {Order} from '../../common/order';
import {OrderItem} from '../../common/order-item';
import {Purchase} from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice = 0;
  totalQuantity = 0;
  creditCardYears: number[] = [];
  creditCardMoths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder, private formService: FormService,
              private cartService: CartService, private checkoutService: CheckoutService, private router: Router) {
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }


  ngOnInit(): void {
    const startMonth: number = new Date().getMonth() + 1;
    const userEmail = JSON.parse(this.storage.getItem('email'));
    this.reviewCartDetails();
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMoths = data;
      }
    );
    this.formService.getCreditCardsYears().subscribe(
      data => {
        console.log('Retrieved credit card years: ' + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    this.formService.getCountries().subscribe(
      data => {
        console.log('Retrieved countries: ' + JSON.stringify(data));
        this.countries = data;
      }
    );

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace]),
        email: new FormControl(userEmail, [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace]),
        state: new FormControl('',
          [Validators.required]),
        country: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace]),
        state: new FormControl('',
          [Validators.required]),
        country: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

  }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.shippingAddressStates = [];
    }

  }

  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer').value);
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    const order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    const orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    const purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls.customer.value;
    purchase.billingAddress = this.checkoutFormGroup.controls.billingAddress.value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.shippingAddress = this.checkoutFormGroup.controls.shippingAddress.value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`);
          this.resetCard();
        }, error: error => {
          alert(`There was an error: ${error.message}`);
        }
      }
    );
  }

  handleMonthsAndYears() {
    const creditCardGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardGroup.value.expirationYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMoths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;

    this.formService.getStates(countryCode).subscribe(
      data => {
        console.log('Retrieved states: ' + JSON.stringify(data));
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  private reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  private resetCard() {
    this.cartService.resetCart();
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
  }
}
