import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';
import { FormArray } from '@angular/forms';

@Injectable()
export class TagsService {
  tags: Tag[];
  constructor() { }

  getTags() {
    if (!this.tags) {
    this.tags = []; 
    const tag1 = new Tag();
    tag1.id = 1;
    tag1.name = 'Best';
    
    const tag2 = new Tag();
    tag2.id = 2;
    tag2.name = 'Worse';

    this.tags.push(tag1);
    this.tags.push(tag2);
    }
    return this.tags;
  }

  updateTags(tagsArray: FormArray) {
    console.log(tagsArray)
    this.tags = this.convertToTagList(tagsArray).filter(x => !x.deleted);
    return this.tags;
  }

  convertToTagList(tagsFormArray): Tag[] {
     const tagList = [];
     for (let i = 0;i < tagsFormArray.length;i++){
       const newTag = new Tag();
       const formTag = tagsFormArray.at(i);
       if (formTag.get('name').value) {
        newTag.id = formTag.get('id').value;
        newTag.name = formTag.get('name').value;
        newTag.deleted = formTag.get('deleted').value;
        newTag.dirty = formTag.get('dirty').value;
        newTag.checked = formTag.get('checked').value;
        tagList.push(newTag);
       }
     }
     return tagList;
  }

  setDirty(tags: Tag[]) {
    // one approach to check if there was an update, other to check in form itself
    // compare the tags and update dirty property for existing
    // tags.forEach(x => {
    //   if (x.id > 0) {
    //     const existingLabel = this.tags.find(y => y.id === x.id);
    //     x.dirty = true;
    //   }
    // })
  }
}