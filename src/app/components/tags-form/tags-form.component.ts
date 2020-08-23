import { Component, OnInit } from '@angular/core';
import { FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Tag } from '../../models/tag';
import { TagsService } from '../../services/tags.service';
import { duplicateValidator } from '../../validators/duplicate.validator'

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

  setDirty(tagsArray: FormArray,i: number) {
     tagsArray.at(i).get('dirty').setValue(true);
  }

  tagInput(i: number) {
    const tagsArray = this.tagsForm.controls.tags as FormArray;
    if (tagsArray.at(i).get('id').value) {
      this.setDirty(tagsArray, i);
    }
    if (i === tagsArray.length - 1) {
      this.addFormControl(undefined, i);
    }
    this.checkDuplicate(tagsArray.at(i).get('name').value);
    //this.checkDuplicates(i);
  }

  checkDuplicate(name: string): boolean {
      console.log(name)
      const tagsArray = this.tagsForm.controls.tags as FormArray;
      let found = -1;
      if (name && name.length > 0) {
        tagsArray.value.forEach(x => x.name === name && found++);
        console.log(found >= 1);
      }

      return found > 1;
  }

  checkDuplicates(currentIndex) {
    const tagsArray = this.tagsForm.controls.tags as FormArray;
    for (let i = 0; i < tagsArray.length; i++)
    {
      let found = -1;
      const tagItem = tagsArray.at(i);
      if (tagItem.get('name').value && tagItem.get('name').value.length > 0) {
        tagsArray.value.forEach(x => x.name === tagItem.get('name').value && found++);
        tagItem.get('duplicate').setValue(found >= 1);
        return found >= 1
      }
    }
    return false;
  }

  maxItems: boolean;
  addFormControl(tagObject?: Tag, i?: number) {
    let tagsArray = this.tagsForm.controls.tags as FormArray;
    
    let arraylen = tagsArray.length;
    if (arraylen >= 5) {
      // exceeded length
      return;
    }

    tagObject = tagObject ? tagObject : new Tag();
    
    tagsArray.insert(arraylen, this.createSingleTag(tagObject));
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
    console.log(this.tagsForm.controls.tags)
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

  setDeleted(i) {
    let tagsArray = this.tagsForm.controls.tags as FormArray;
       
    const item = tagsArray.at(i)
    if (!item.get('id').value || item.get('id').value <= 0) {
        tagsArray.removeAt(i);
    } else
    {
      if (tagsArray.at(i).get('checked').value) {
        tagsArray.at(i).get('dirty').setValue(true);
      } 
    }
  }
  onSubmit() {
    
     // TODO: Use EventEmitter with form value
     const tagList = [];
     const allTags = this.tagsForm.controls.tags as FormArray
    console.warn(allTags);
    return;
     for (let i=0;i < allTags.length;i++){
        const newTag = new Tag();
        const formTag = allTags.at(i);
       if (!formTag.get('name').value) {
         continue;
       }
        newTag.id = formTag.get('id').value;
        newTag.name = formTag.get('name').value;
        newTag.deleted = formTag.get('deleted').value;
        newTag.dirty = formTag.get('dirty').value;
        newTag.checked = formTag.get('checked').value;
        tagList.push(newTag);
     }
    this.buildForm();
  }
}