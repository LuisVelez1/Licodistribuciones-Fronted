import { Pipe, PipeTransform } from '@angular/core';
import { FixedAsset } from './fixed-assets';

@Pipe({ name: 'countByStatus', standalone: true })
export class CountByStatusPipe implements PipeTransform {
  transform(assets: FixedAsset[], status: string): number {
    return assets.filter(a => a.status === status).length;
  }
}
