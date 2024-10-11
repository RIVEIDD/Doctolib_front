import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchZoneComponent } from '../search-zone/search-zone.component';
import { SbottomComponent } from '../sbottom/sbottom.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchZoneComponent, SbottomComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
