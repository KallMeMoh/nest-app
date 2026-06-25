import { Global, Module } from '@nestjs/common';
import { CryptoService } from './cropto.service';

@Global()
@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
