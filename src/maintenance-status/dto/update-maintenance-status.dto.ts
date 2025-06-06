import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceStatusDto } from './create-maintenance-status.dto';

export class UpdateMaintenanceStatusDto extends PartialType(CreateMaintenanceStatusDto) {}
