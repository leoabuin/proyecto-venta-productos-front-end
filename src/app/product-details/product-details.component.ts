import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiProductService } from '../service/productApi.service.js';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { ApiService } from '../service/api.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component.js';
import { LocalStorageService } from '../service/local-storage.service.js';
import { Router } from '@angular/router';
import { ApiCommentService } from '../service/commentApi.service.js';
import { AuthService } from '../service/auth.service.js';

interface Price {
  id: number;
  dateFrom: Date;
  dateUntil: Date;
  cost: number;
  productId: number;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, FooterComponent, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {


  sizes = ['S', 'M', 'L', 'XL', 'XXL']
  selectedSize = ''
  product: any
  currentPrice: Price | undefined
  quantity: number = 1
  stock: number = 0
  showProductAdd: boolean = false

  selectSize(size: string) {
    this.selectedSize = size;
  }

  comments: any[] = [];


  newCommentName: string = '';
  newCommentText: string = '';


  constructor(
    private route: ActivatedRoute,
    private service: ApiProductService,
    private brandService: ApiService,
    private localStorageService: LocalStorageService,
    private commentService: ApiCommentService,
    private router: Router,
    public authService: AuthService) { }

  productId: string | null = null;
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')
    if (this.productId) {
      this.loadProductDetails(this.productId);
      this.loadComments(this.productId);
    }

  }

  loadProductDetails(id: string): void {
    this.service.getProductbyId(id).subscribe({
      next: (response) => {
        this.product = response.data;
        this.currentPrice = this.getCurrentPrice(this.product.prices)
        this.stock = this.product.stock
        console.log('Detalles del producto cargados con éxito:', this.product);

        this.loadBrandName(this.product.brand);
      },
      error: (err) => {
        console.error('Error al cargar los detalles del producto:', err);
      }
    });
  }

  loadBrandName(brandId: string): void {
    this.brandService.getBrandbyId(brandId).subscribe({
      next: (response) => {
        // Verifica si la respuesta contiene el objeto 'data'
        if (response && response.data && response.data.name) {
          this.product.brandName = response.data.name; // Accede al nombre de la marca
          console.log('Nombre de la marca cargado con éxito:', this.product.brandName);
        } else {
          console.warn('Respuesta de marca inesperada:', response);
        }
      },
      error: (err) => {
        console.error('Error al cargar el nombre de la marca:', err);
      }
    });
  }

  getCurrentPrice(prices: Price[]): Price | undefined {
    if (!prices || prices.length === 0) return undefined;

    // Mostramos en consola para debuggear
    console.log('Todos los precios de este producto:', prices);

    // Ordenamos por ID de mayor a menor (el ID más alto es el último creado)
    const sortedPrices = [...prices].sort((a, b) => b.id - a.id);

    const newestPrice = sortedPrices[0];

    console.log('El precio más nuevo (por ID) es:', newestPrice);

    return newestPrice;
  }

  incrementQuantity(): void {
    if (this.quantity < this.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    const cartItem = {
      productId: this.product.id,
      quantity: this.quantity,
      item_price: (this.currentPrice ? this.currentPrice.cost : 0) * this.quantity,
    }


    let cart = JSON.parse(this.localStorageService.getItem('cart') || '[]')
    let cartToshow = JSON.parse(this.localStorageService.getItem('cartToshow') || '[]')

    const existingItemIndex = cart.findIndex((item: any) => item.productId === cartItem.productId)

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += this.quantity;
    } else {
      cart.push(cartItem)
    }

    const productDetails = {
      productId: this.product.id,
      name: this.product.name,
      imagen: this.product.imagen,
      quantity: this.quantity,
      item_price: (this.currentPrice ? this.currentPrice.cost : 0) * this.quantity,
    };


    const existingShowIndex = cartToshow.findIndex((item: any) => item.productId === productDetails.productId)

    if (existingShowIndex > -1) {

      cartToshow[existingShowIndex].quantity += this.quantity
      cartToshow[existingShowIndex].item_price += productDetails.item_price
    } else {
      cartToshow.push(productDetails)
    }


    this.localStorageService.setItem('cart', JSON.stringify(cart))
    this.localStorageService.setItem('cartToshow', JSON.stringify(cartToshow))

    console.log('Producto agregado al carrito:', cartItem)
    console.log('Carrito actualizado:', cart)
    console.log('Carrito a mostrar actualizado:', cartToshow)

    this.showProductAdd = true
  }

  closeProductAddSuccessMessage() {
    this.showProductAdd = false
    this.router.navigate(['/products'])
  }


  loadComments(id: string): void {

    this.commentService.findCommentsByProduct(id).subscribe({
      next: (response) => {
        // Suponiendo que el backend devuelve { message: '...', data: comments }
        this.comments = response.data;
      },
      error: (err) => {
        console.error('Error loading comments', err);
      }
    });
  }

  submitComment(): void {
    // Construir el objeto con la data que espera el backend

    if (!this.newCommentText || this.newCommentText.trim() === '') {
      console.error('El comentario no puede estar vacío.');
      return;
    }


    const storedUserId = localStorage.getItem('idUsuario');
    if (!storedUserId) {
      console.error('No se encontró el idUsuario en el localStorage.');
      return;
    }

    const userId = Number(storedUserId);
    if (isNaN(userId)) {
      console.error('El idUsuario almacenado no es un número válido.');
      return;
    }

    if (!this.productId) {
      console.error('Error: productId no está definido.');
      return;
    }

    const productIdNumber = Number(this.productId);
    if (isNaN(productIdNumber) || productIdNumber <= 0) {
      console.error('Error: productId no es un número válido:', this.productId);
      return;
    }
    console.log('ID PRODUCTO:', productIdNumber)

    const commentData = {
      productId: productIdNumber,
      userId: userId,
      comment: this.newCommentText.trim()

    };

    console.log('Enviando comentario:', commentData);

    // Opcional: podrías incluir también el nombre si el backend lo requiere
    // Por ejemplo, podrías agregarlo a sanitizedCommentInput o enviarlo en otro atributo

    this.commentService.add(commentData).subscribe({
      next: (response) => {
        console.log('Comment created', response);
        // Agrega el comentario recién creado a la lista de comentarios
        this.comments.push(response.data);
        // Limpia los campos del formulario
        this.newCommentText = '';
      },
      error: (err) => {
        console.error('Error creating comment', err);
      }
    });
  }

  modificarPrecio() {
    const nuevoPrecio = prompt("Ingrese el nuevo precio para el producto:", this.currentPrice?.cost.toString());
    if (nuevoPrecio && !isNaN(Number(nuevoPrecio))) {
      // Por ahora solo un log para verificar que el botón responde
      console.log("Cambiando precio a:", nuevoPrecio);
      // Aquí luego haremos el llamado al servicio
    }
  }

  toggleOferta() {
    const nuevoEstado = !this.product.isOffer;

    this.service.updateOnlyOffer(this.product.id, nuevoEstado).subscribe({
      next: (res) => {
        this.product.isOffer = nuevoEstado; // Actualizamos la vista inmediatamente
        console.log('Oferta cambiada con éxito');
      },
      error: (err) => alert('Error al cambiar el estado de la oferta')
    });
  }

  discontinuarProducto() {
    const confirmar = confirm("¿Estás seguro de que quieres discontinuar este producto? Dejará de ser visible para los clientes.");
    if (confirmar) {
      console.log("Producto discontinuado (lógica pendiente)");
      // Aquí llamarías al servicio para poner isDiscontinued en true
    }
  }

}
