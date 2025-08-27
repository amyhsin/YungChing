import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-attractions',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CheckboxModule, SelectModule, FormsModule],
  templateUrl: './attractions.html',
  styleUrl: './attractions.scss',
})
export class Attractions implements OnInit {
  attractions: any[] = [];
  filteredAttractions: any[] = [];
  categories: any[] = [];
  categoriesFromApi: any[] = [];
  selectedCategory: any = null;
  pagedAttractions: any[] = [];
  totalRecords = 0;
  loading = false;
  selectedAttractions: any[] = [];
  favorites: any[] = [];
  rows = 10; // 每頁 10 筆
  first = 0; // 當前頁面 index

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchAttractions();
    this.fetchCategories();
  }

  fetchAttractions() {
    this.loading = true;
    const url = 'https://www.travel.taipei/open-api/zh-tw/Attractions/All';
    this.http.get(url).subscribe({
      next: (res: any) => {
        this.attractions = res.data ?? [];
        this.filteredAttractions = [...this.attractions];
        this.totalRecords = this.attractions.length;
        // this.updatePagedData();
        this.loading = false;
        console.log('attractions', this.attractions);
      },
      error: (err) => {
        console.error('Fetch Error: ', err);
      },
    });
  }

  fetchCategories() {
    const url =
      'https://www.travel.taipei/open-api/zh-tw/Miscellaneous/Categories?type=Attractions';
    this.http.get(url).subscribe({
      next: (res: any) => {
        this.categoriesFromApi = res.data.Category ?? [];
        this.categories = [{ id: 0, name: '全部' }, ...this.categoriesFromApi];
        this.selectedCategory = this.categories[0].id;
        console.log('categories', this.categories);
      },
      error: (err) => {
        console.error('Fetch Categories Error: ', err);
      },
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    // this.updatePagedData();
  }

  onCategoryChange() {
    console.log('selected id: ', this.selectedCategory);
    if (!this.selectedCategory || this.selectedCategory === 0) {
      this.filteredAttractions = [...this.attractions];
      return;
    }

    // const selectedId = this.selectedCategory.id;
    this.filteredAttractions = this.attractions.filter((attr) =>
      attr.category?.some((c: any) => c.id === this.selectedCategory)
    );

    console.log('filteredAttractions', this.filteredAttractions);
  }

  // addToFavorite(selectedFavorite: any) {
  //   console.log("selected: ", selectedFavorite);
  // }

  // updatePagedData() {
  //   console.log("first", this.first);
  //   console.log("rows", this.first + this.rows);
  //   this.pagedAttractions = [...this.attractions.slice(this.first, this.first + this.rows)];
  //   // this.pagedAttractions = this.attractions.slice(this.first, this.first + this.rows);
  //   console.log("result", this.pagedAttractions);
  //   // this.cdr.detectChanges();
  // }

  // loadAttractions(event: TableLazyLoadEvent) {
  //   this.loading = true;

  //   const pageIndex = (event.first ?? 0) / (event.rows ?? 30) + 1;

  //   // https://www.travel.taipei/open-api/zh-tw/Attractions/All?page=${pageIndex}
  //   this.http
  //     .get<any>(`https://www.travel.taipei/open-api/zh-tw/Attractions/All`, {
  //       // headers: {
  //       //   Accept: 'application/json',
  //       //   Referer: 'https://www.travel.taipei/',
  //       //   'User-Agent':
  //       //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  //       //     '(KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
  //       // },
  //     })
  //     .subscribe({
  //       next: (res) => {
  //         this.attractions = res.data ?? [];
  //         this.totalRecords = res.total ?? 400;
  //         this.loading = false;
  //         this.cdr.detectChanges();
  //       },
  //       error: (err) => {
  //         console.error('API Error:', err);
  //         this.loading = false;
  //       },
  //     });
  // }

  addFavorites() {}
}
