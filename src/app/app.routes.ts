import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component.js';
import { LogInComponent } from './log-in/log-in.component.js';
import { BrandListComponent } from './brand-list/brand-list.component.js';
import { AddbrandsComponent } from './addbrands/addbrands.component.js';
import { AddcategoriesComponent } from './addcategories/addcategories.component.js';
import { CategoriesListComponent } from './categories-list/categories-list.component.js';
import { NosotrosComponent } from './nosotros/nosotros.component.js';
import { DistributorListComponent } from './distributor-list/distributor-list.component.js';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent }, 
    {path: 'login', component: LogInComponent},
    {path: 'brand-list', component: BrandListComponent},
    {path: 'addBrands', component: AddbrandsComponent},
    {path: 'addCategories', component: AddcategoriesComponent},
    {path: 'categories-list', component: CategoriesListComponent},
    {path: 'aboutUs', component: NosotrosComponent},
    {path: 'distributors-list', component: DistributorListComponent}
];
