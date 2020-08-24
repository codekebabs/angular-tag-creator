import { Component, OnInit } from '@angular/core';
import { FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Tag } from '../../models/tag';
import { TagsService } from '../../services/tags.service';

@Component({
  selector: 'app-tags-form',
  templateUrl: './tags-form.component.html',
  styleUrls: ['./tags-form.component.css']
})
export class TagsFormComponent implements OnInit {
  tagsForm: FormGroup;
  
  constructor(private fb: FormBuilder,
              private tagsService: TagsService) { }

  ngOnInit() {
     this.buildForm();
  }

  initializeForm() {
    this.tagsForm = this.fb.group({
    tags: this.fb.array([
  ])
  });
  }

  setDirty(tagItem: AbstractControl, value: boolean) {
     tagItem.get('dirty').setValue(value);
  }

  tagInput(i: number) {
    const tagItem = this.tagsFormArray.at(i);
    if (tagItem.get('id').value) {
      this.setDirty(tagItem, true);
    }
    if (i ===  this.tagsFormArray.length - 1) {
      this.addFormControl(undefined, i);
    }
    this.checkDuplicates(i);
  }

  checkDuplicates(currentIndex) {
    for (let i = 0; i <  this.tagsFormArray.length; i++)
    {
      let found = -1;
      const tagItem =  this.tagsFormArray.at(i);
      if (tagItem.get('name').value && tagItem.get('name').value.length > 0) {
         this.tagsFormArray.value.forEach(x => x.name === tagItem.get('name').value && found++);
        if (i === currentIndex) { 
          tagItem.get('duplicate').setValue(found >= 1);
        } else if (found <= 0) {
          tagItem.get('duplicate').setValue(false);
        }
        console.log(tagItem.get('name').errors)
        tagItem.get('name').setErrors(found >= 1 ? { duplicate: true
      }: tagItem.get('name').errors);
      }
    }
  }

  maxItems: boolean;
  addFormControl(tagObject?: Tag, i?: number) {
    let tagsArray = this.tagsForm.controls.tags as FormArray;
    
    let arraylen =  this.tagsFormArray.length;
    if (arraylen >= 5) {
      // exceeded length
      return;
    }

    tagObject = tagObject ? tagObject : new Tag();
    
     this.tagsFormArray.insert(arraylen, this.createSingleTag(tagObject));
  }

  createSingleTag(tagObject: Tag) {
     return this.fb.group({
          checked: new FormControl(tagObject.checked),
          name: [tagObject.name, tagObject.id || tagObject.id > 0 ? Validators.compose([Validators.required, Validators.maxLength(5)]): Validators.maxLength(5)],
          id: [tagObject.id],
          deleted: new FormControl(tagObject.deleted),
          dirty: new FormControl(tagObject.dirty),
          duplicate: new FormControl(false)
      });
  }

  reset() {
    this.buildForm();
  }

  buildForm() {
    this.initializeForm();
    const allTags = this.tagsService.getTags();
    allTags.forEach(tag => this.addFormControl(tag));
    if (allTags.length < 5) {
      this.addFormControl();
    }
  }

  delete(i) {
    const tagsArray = this.tagsForm.controls.tags as FormArray;
    const item =  this.tagsFormArray.at(i)
    if (!item.get('id').value || item.get('id').value < 0) {
         this.tagsFormArray.removeAt(i);
    } else if (!item.get('deleted').value) {
        this.setDirty(item, true);
      } 
  }

  get tagsFormArray(): FormArray {
    return this.tagsForm.controls.tags as FormArray;
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.tagsService.updateTags(this.tagsFormArray);
    this.buildForm();
  }


}