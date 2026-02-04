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
import { MyOrdersComponent } from './my-orders/my-orders.component.js';

import { roleGuard } from './auth.guard';
import { UpdateUserComponent } from './update-user/update-user.component.js';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent }, 
    { path: 'login', component: LogInComponent },
    { path: 'register', component: RegisterUserComponent },
    { path: 'aboutUs', component: NosotrosComponent },
    { path: 'products', component: ProductsListComponent },
    { path: 'product-details/:id', component: ProductDetailsComponent },
    { path: 'footer', component: FooterComponent },

    // --- RUTAS DE COMPRA (Solo Clientes) ---
    { path: 'cart', component: ShoppingCartComponent, canActivate: [roleGuard(['Cliente'])] },
    { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [roleGuard(['Cliente'])] },
    { path: 'myOrders/:idUser', component: MyOrdersComponent, canActivate: [roleGuard(['Cliente'])] },
    {path: 'add-to-cart', component: ShoppingCartComponent, canActivate: [roleGuard(['Cliente'])]},

    // --- RUTAS DE GESTIÓN (Solo Empleados) ---
    { path: 'brand-list', component: BrandListComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'addBrands', component: AddbrandsComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'addCategories', component: AddcategoriesComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'categories-list', component: CategoriesListComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'distributors-list', component: DistributorListComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'addProduct', component: AddProductComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'update-category/:id', component: UpdateCategoryComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'change-price', component: ChangePriceComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'update-distributor/:id', component: UpdateDistributorComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'addDistributor', component: AddDistributorComponent, canActivate: [roleGuard(['Empleado'])] },
    { path: 'change-price/:id', component: ChangePriceComponent, canActivate: [roleGuard(['Empleado'])]},
    

    // --- RUTAS COMUNES (Ambos necesitan estar logueados) ---
    { path: 'updateUser/:idUser', component: UpdateUserComponent, canActivate: [roleGuard(['Cliente', 'Empleado'])] }
];
