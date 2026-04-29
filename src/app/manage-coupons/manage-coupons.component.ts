import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { FooterComponent } from '../footer/footer.component.js';
import { CouponApiService } from '../service/coupon-api.service.js';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component.js';

@Component({
  selector: 'app-manage-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent, LoadingSpinnerComponent],
  templateUrl: './manage-coupons.component.html',
  styleUrl: './manage-coupons.component.scss'
})
export class ManageCouponsComponent implements OnInit {
  coupons: any[] = [];
  isLoading = false;
  showForm = false;
  isEditing = false;
  formError = '';
  formSuccess = '';
  deleteConfirmId: number | null = null;

  // Form fields
  form = {
    id: null as number | null,
    code: '',
    discountPercentage: null as number | null,
    expirationDate: ''
  };

  constructor(private couponService: CouponApiService) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons() {
    this.isLoading = true;
    this.couponService.getAll().subscribe({
      next: (response) => {
        this.coupons = response.data || response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar cupones:', err);
        this.isLoading = false;
      }
    });
  }

  openCreateForm() {
    this.isEditing = false;
    this.form = { id: null, code: '', discountPercentage: null, expirationDate: '' };
    this.formError = '';
    this.formSuccess = '';
    this.showForm = true;
  }

  openEditForm(coupon: any) {
    this.isEditing = true;
    // Format date for the date input (YYYY-MM-DD)
    const expDate = new Date(coupon.expirationDate);
    const formatted = expDate.toISOString().split('T')[0];
    this.form = {
      id: coupon.id,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      expirationDate: formatted
    };
    this.formError = '';
    this.formSuccess = '';
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.formError = '';
    this.formSuccess = '';
  }

  validateForm(): boolean {
    if (!this.form.code || this.form.code.trim() === '') {
      this.formError = 'El código del cupón es requerido.';
      return false;
    }
    if (!this.form.discountPercentage || this.form.discountPercentage <= 0 || this.form.discountPercentage > 100) {
      this.formError = 'El porcentaje de descuento debe estar entre 1 y 100.';
      return false;
    }
    if (!this.form.expirationDate) {
      this.formError = 'La fecha de vencimiento es requerida.';
      return false;
    }
    if (new Date(this.form.expirationDate) <= new Date()) {
      this.formError = 'La fecha de vencimiento debe ser futura.';
      return false;
    }
    return true;
  }

  submitForm() {
    this.formError = '';
    this.formSuccess = '';

    if (!this.validateForm()) return;

    const payload = {
      code: this.form.code.trim().toUpperCase(),
      discountPercentage: this.form.discountPercentage!,
      expirationDate: new Date(this.form.expirationDate).toISOString()
    };

    this.isLoading = true;

    if (this.isEditing && this.form.id) {
      this.couponService.update(this.form.id, payload).subscribe({
        next: () => {
          this.formSuccess = `Cupón "${payload.code}" actualizado exitosamente.`;
          this.isLoading = false;
          this.loadCoupons();
          setTimeout(() => this.closeForm(), 1500);
        },
        error: (err) => {
          this.formError = err.error?.message || 'Error al actualizar el cupón.';
          this.isLoading = false;
        }
      });
    } else {
      this.couponService.create(payload).subscribe({
        next: () => {
          this.formSuccess = `Cupón "${payload.code}" creado exitosamente.`;
          this.isLoading = false;
          this.loadCoupons();
          setTimeout(() => this.closeForm(), 1500);
        },
        error: (err) => {
          this.formError = err.error?.message || 'Error al crear el cupón.';
          this.isLoading = false;
        }
      });
    }
  }

  confirmDelete(id: number) {
    this.deleteConfirmId = id;
  }

  cancelDelete() {
    this.deleteConfirmId = null;
  }

  deleteCoupon(id: number) {
    this.isLoading = true;
    this.couponService.delete(id).subscribe({
      next: () => {
        this.coupons = this.coupons.filter(c => c.id !== id);
        this.deleteConfirmId = null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al eliminar cupón:', err);
        this.deleteConfirmId = null;
        this.isLoading = false;
      }
    });
  }

  isExpired(expirationDate: string): boolean {
    return new Date(expirationDate) < new Date();
  }

  getDaysUntilExpiry(expirationDate: string): number {
    const diff = new Date(expirationDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
