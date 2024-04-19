import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../components/shared/page-header/page-header.component";
import { ReactIconComponent } from '../../components/shared/react-icon/react-icon.component';

import { BsAlarm } from "react-icons/bs";
import { NavbarComponent } from "../../components/shared/navbar/navbar.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [PageHeaderComponent, ReactIconComponent, NavbarComponent]
})
export class HomeComponent {
    BsAlarm = BsAlarm;
}
