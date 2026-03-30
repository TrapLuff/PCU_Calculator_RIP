import { Module, Global } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { MinioService } from '../services/minio.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}