import { Pipe, PipeTransform } from '@angular/core';
import { FixedAssetResponse } from '../../core/models/fixed-asset.model';

@Pipe({
  name: 'countByStatus',
  standalone: true
})
export class CountByStatusPipe implements PipeTransform {
  transform(assets: FixedAssetResponse[], status: string): number {
    return assets.filter(a => a.status === status).length;
  }
}