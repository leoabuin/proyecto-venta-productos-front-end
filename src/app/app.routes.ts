import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component.js';
import { LogInComponent } from './log-in/log-in.component.js';
import { BrandListComponent } from './brand-list/brand-list.component.js';
import { AddbrandsComponent } from './addbrands/addbrands.component.js';
import { AddcategoriesComponent } from './addcategories/addcategories.component.js';
import { CategoriesListComponent } from './categories-list/categories-list.component.js';
import { NosotrosComponent } from './nosotros/nosotros.component.js';
import { DistributorListComponent } from './distributor-list/distributor-list.component.js';
import { RegisterUserComponent } from './register-user/register-user.component.js';
import { ProductsListComponent } from './products-list/products-list.component.js';
import { AddProductComponent } from './add-product/add-product.component.js';
import { ProductDetailsComponent } from './product-details/product-details.component.js';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component.js';
import { UpdateCategoryComponent } from './update-category/update-category.component.js';
import { ChangePriceComponent } from './change-price/change-price.component.js';
import { UpdateDistributorComponent } from './update-distributor/update-distributor.component.js';
import { AddDistributorComponent } from './add-distributor/add-distributor.component.js';
import { FooterComponent } from './footer/footer.component.js';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent }, 
    {path: 'login', component: LogInComponent},
    {path: 'brand-list', component: BrandListComponent},
    {path: 'addBrands', component: AddbrandsComponent},
    {path: 'addCategories', component: AddcategoriesComponent},
    {path: 'categories-list', component: CategoriesListComponent},
    {path: 'aboutUs', component: NosotrosComponent},
    {path: 'distributors-list', component: DistributorListComponent},
    {path: 'register', component: RegisterUserComponent},
    {path: 'products', component: ProductsListComponent},
    {path: 'addProduct', component: AddProductComponent},
    {path: 'product-details/:id', component: ProductDetailsComponent},
    {path: 'cart', component: ShoppingCartComponent},
    {path: 'update-category/:id', component: UpdateCategoryComponent},
    {path: 'change-price', component: ChangePriceComponent},
    {path: 'update-category/:id', component: UpdateDistributorComponent},
    {path: 'addDistributor', component: AddDistributorComponent},
    {path: 'shopping-cart', component: ShoppingCartComponent},
    {path: 'footer', component: FooterComponent}


];
