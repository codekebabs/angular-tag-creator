import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';

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

  updateTags(tags: Tag[]) {
    this.tags = tags.filter(x => !x.deleted);
    this.tags.forEach(x => x.id = x.id === 0 || !x.id ? 12 : x.id);
    return this.tags;
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