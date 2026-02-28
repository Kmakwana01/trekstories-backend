import { Module, Global } from '@nestjs/common';
import { ImgbbService } from './services/imgbb.service';

@Global()
@Module({
    providers: [ImgbbService],
    exports: [ImgbbService],
})
export class CommonModule { }
