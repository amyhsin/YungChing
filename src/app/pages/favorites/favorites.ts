import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, TableModule, ButtonModule, CheckboxModule, SelectModule, FormsModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  favoriteAttractions: any[] = [];
  categoriesFromApi: any[] = [];
  categories: any[] = [];
  selectedCategory: any = null;
  filteredAttractions: any[] = [];
  totalRecords = 0;
  first = 0;
  rows = 10;
  selectedAttractions: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchCategories();

    // 1. 讀取 localStorage 的最愛
    const stored = localStorage.getItem('favoriteAttractions');
    this.favoriteAttractions = stored ? JSON.parse(stored) : [];
    this.filteredAttractions = this.favoriteAttractions;

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

  onCategoryChange() {
    if (!this.selectedCategory || this.selectedCategory === 0) {
      // 全部分類
      this.filteredAttractions = [...this.favoriteAttractions];
    } else {
      const selectedId = this.selectedCategory;
      this.filteredAttractions = this.favoriteAttractions.filter((attr) =>
        attr.category?.some((c: any) => c.id === selectedId)
      );
    }

    this.totalRecords = this.filteredAttractions.length;
    console.log('total ', this.totalRecords);
    this.first = 0;

    console.log('filteredAttractions', this.filteredAttractions);
  }

   onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  removeFromFavorite(selectedFavorite: any) {
    console.log('selected: ', selectedFavorite);
    if (!selectedFavorite || selectedFavorite.length < 1) return;

    selectedFavorite.forEach((selectedItem: any) => {
      this.favoriteAttractions = this.favoriteAttractions.filter((item) => selectedItem.id !== item.id);
      console.log("id: ", selectedItem.id)
    });

    this.filteredAttractions = this.favoriteAttractions;

    // 存到 localStorage
    localStorage.setItem('favoriteAttractions', JSON.stringify(this.favoriteAttractions));

  }
}
