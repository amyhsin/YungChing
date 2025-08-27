import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-attractions',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CheckboxModule],
  templateUrl: './attractions.html',
  styleUrl: './attractions.scss',
})
export class Attractions implements OnInit {
  attractions: any[] = [];
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
  }

  fetchAttractions() {
    this.loading = true;
    const url = 'https://www.travel.taipei/open-api/zh-tw/Attractions/All';
    this.http.get(url).subscribe({
      next: (res: any) => {
        this.attractions = res.data ?? [];
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

   onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    // this.updatePagedData();
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
