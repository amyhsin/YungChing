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
  favoriteAttractions: any[] = [];
  favorites: any[] = [];
  rows = 10; // 每頁 10 筆
  first = 0; // 當前頁面 index

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchAttractions();
    this.fetchCategories();

     // 1. 讀取 localStorage 的最愛
    const stored = localStorage.getItem("favoriteAttractions");
    this.favoriteAttractions = stored ? JSON.parse(stored) : [];

    // 2. 讓表格勾選對應的景點
    this.selectedAttractions = this.filteredAttractions.filter(attraction =>
      this.favoriteAttractions.some(fav => fav.id === attraction.id)
    );

    this.cdr.detectChanges();
  }

  fetchAttractions() {
    this.loading = true;
    const url = 'https://www.travel.taipei/open-api/zh-tw/Attractions/All';
    this.http.get(url).subscribe({
      next: (res: any) => {
        this.attractions = res.data ?? [];
        this.filteredAttractions = [...this.attractions];
        this.totalRecords = this.attractions.length;
        this.updatePagedData();
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
    this.updatePagedData();
  }

  onCategoryChange() {
    if (!this.selectedCategory || this.selectedCategory === 0) {
      // 全部分類
      this.filteredAttractions = [...this.attractions];
    } else {
      const selectedId = this.selectedCategory;
      this.filteredAttractions = this.attractions.filter((attr) =>
        attr.category?.some((c: any) => c.id === selectedId)
      );
    }

    this.totalRecords = this.filteredAttractions.length;
    console.log('total ', this.totalRecords);
    this.first = 0;
    this.updatePagedData();

    console.log('filteredAttractions', this.filteredAttractions);
  }

  // isFavorite(attraction: any): boolean {
  //   this.favoriteAttractions = JSON.parse(localStorage.getItem("favoriteAttractions") ?? '[]');
  //   console.log("fav: ", this.favoriteAttractions);
  //   return this.favoriteAttractions.some((fav) => fav.id === attraction.id);
  // }

  addToFavorite(selectedFavorite: any) {
    console.log('selected: ', selectedFavorite);
    if (!selectedFavorite || selectedFavorite.length < 1) return;

    // 避免重複加入
    selectedFavorite.forEach((item: any) => {
      const exists = this.favoriteAttractions.find((fav) => fav.id === item.id);
      if (!exists) {
        this.favoriteAttractions.push(item);
      }
    });

    // 存到 localStorage
    localStorage.setItem('favoriteAttractions', JSON.stringify(this.favoriteAttractions));

    console.log('已加入最愛: ', this.favoriteAttractions);
  }

  updatePagedData() {
    const start = this.first;
    const end = this.first + this.rows;
    this.pagedAttractions = this.filteredAttractions.slice(start, end);
  }

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
