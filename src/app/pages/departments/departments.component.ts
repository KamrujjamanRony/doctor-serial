import { Component, inject } from '@angular/core';
import { TbDental } from "react-icons/tb";
import { MdMonitorHeart } from "react-icons/md";
import { FaHouseChimneyMedical } from "react-icons/fa6";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { FaHandHoldingMedical } from "react-icons/fa";
import { FaMicroscope } from "react-icons/fa";
import { PageHeaderComponent } from "../../components/shared/page-header/page-header.component";
import { CategoryComponent } from "../../components/category/category.component";
import { ReactIconComponent } from '../../components/shared/react-icon/react-icon.component';
import { DepartmentService } from '../../features/services/department.service';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-departments',
  standalone: true,
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
  imports: [PageHeaderComponent, CategoryComponent, ReactIconComponent]
})
export class DepartmentsComponent {
  departmentService = inject(DepartmentService)
  icons = { TbDental, MdMonitorHeart, FaHouseChimneyMedical, FaBriefcaseMedical, FaHandHoldingMedical, FaMicroscope };
  // categories = [
  //   {
  //     id: crypto.randomUUID(),
  //     name: "dental",
  //     img: this.icons.TbDental,
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     name: "cardiology",
  //     img: this.icons.MdMonitorHeart,
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     name: "surgery",
  //     img: this.icons.FaHouseChimneyMedical,
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     name: "microbiology",
  //     img: this.icons.FaMicroscope,
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     name: "neuromedicine",
  //     img: this.icons.FaHandHoldingMedical,
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     name: "medicine",
  //     img: this.icons.FaBriefcaseMedical,
  //   },
  // ];

  constructor() { }

  ngOnInit(): void {}

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }))
}
