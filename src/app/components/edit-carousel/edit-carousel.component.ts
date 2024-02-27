import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoverComponent } from '../shared/cover/cover.component';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environments';
import { CarouselService } from '../../features/services/carousel.service';

@Component({
  selector: 'app-edit-carousel',
  templateUrl: './edit-carousel.component.html',
  standalone: true,
  imports: [CoverComponent, FormsModule]
})
export class EditCarouselComponent implements OnInit, OnDestroy {
  yourTitle: any = 'Update Carousel information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Edit Carousel';
  id: any = null;
  url!: any;
  err: any = '';
  emptyImg: any = environment.emptyImg;
  private file?: File;
  carouselInfo?: any;
  paramsSubscription?: Subscription;
  editCarouselSubscription?: Subscription;
  constructor(private route: ActivatedRoute, private router: Router, private carouselService: CarouselService) { }
  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.carouselService.getCarousel(this.id)
            .subscribe({
              next: (response) => {
                this.carouselInfo = response;
                this.url = response.imageUrl;
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {

    const formData = new FormData();

    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('Title', this.carouselInfo?.title ?? '');
    formData.append('Description', this.carouselInfo?.description ?? '');
    if (this.file instanceof File) {
      formData.append('ImageFormFile', this.file);
    } 
    else {
      formData.append('ImageUrl', this.url ?? '');
    }

    if (this.id) {
      this.editCarouselSubscription = this.carouselService.updateCarousel(this.id, formData)
        .subscribe({
          next: (response) => {
            this.router.navigate(['mte12/carousel']);
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editCarouselSubscription?.unsubscribe();
  }

  onFileChange(event: any): void {
    const element = event.currentTarget as HTMLInputElement;


    if (element.files && element.files.length > 0) {
      const file = element.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const uint = new Uint8Array(reader.result as ArrayBuffer);
        const bytes: any = [];

        uint.forEach((byte) => {
          bytes.push(byte.toString(16));
        });

        const hex = bytes.join('').toUpperCase();

        if (hex.startsWith('89504E47') || hex.startsWith('FFD8FFDB') || hex.startsWith('FFD8FFE0')) {
          this.file = element.files?.[0];
          this.err = '';
        } else {
          this.err = 'Invalid file type. Please upload a valid image file.';
          element.value = '';
        }
      };

      reader.readAsArrayBuffer(file);
    }
  }
}
