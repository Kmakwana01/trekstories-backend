import { IsString, IsNotEmpty, IsNumber, Min, MaxLength } from 'class-validator';

export class RequestRefundDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    reason: string;
}

export class ApproveRefundDto {
    @IsNumber()
    @Min(0)
    refundAmount: number;

    @IsString()
    @MaxLength(1000)
    refundAdminNote: string;
}

export class RejectRefundDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    reason: string;
}
