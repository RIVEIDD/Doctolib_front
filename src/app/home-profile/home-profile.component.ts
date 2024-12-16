import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchZoneComponent } from '../search-zone/search-zone.component';
import { SbottomComponent } from '../sbottom/sbottom.component';

@Component({
  selector: 'app-home-profile',
  standalone: true,
  imports: [CommonModule, SearchZoneComponent, SbottomComponent],
  templateUrl: './home-profile.component.html',
  styleUrl: './home-profile.component.scss'
})
export class HomeProfileComponent {

}
