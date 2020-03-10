import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Place } from 'src/app/models/place';
import { TypePlace } from 'src/app/models/type-place';
import { TypeService } from 'src/app/services/type.service';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.css']
})
export class AddPlaceComponent implements OnInit {
  place: Place;
  types: TypePlace[];

  constructor(
    private typeServices: TypeService,
    public dialogRef: MatDialogRef<AddPlaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Place) {
    this.place = this.data;
  }

  ngOnInit(): void {
    this.typeServices.getAllTypes().subscribe((typePlace: TypePlace[]) => this.types = typePlace);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
