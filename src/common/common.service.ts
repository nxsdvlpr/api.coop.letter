import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import * as bcrypt from 'bcrypt';
import { SiDScalar } from './sid.scalar';
import { format } from 'date-fns';

@Injectable()
export class CommonService {
  slugify(slug: string): string {
    return slugify(slug, {
      replacement: '-',
      lower: true,
      remove: /[*+~.()'"!:@#]/g,
    });
  }

  randomString(length = 6): string {
    return Math.random().toString(36).substr(2, length);
  }

  passwordHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  currency(num) {
    if (num === null || num === undefined) {
      return 0;
    }

    return num.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  monthAdd(date, month) {
    let d = new Date(date);
    d = new Date(date.getFullYear(), date.getMonth(), 1);
    d.setMonth(d.getMonth() + (month + 1));
    d.setDate(d.getDate() - 1);

    if (date.getDate() < d.getDate()) {
      d.setDate(date.getDate());
    }

    return format(d, 'yyyy-MM-dd');
  }

  dateDiffInDays(a: Date, b: Date) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  genSid(num: number) {
    const sid = new SiDScalar();
    return sid.serialize(num);
  }
}
