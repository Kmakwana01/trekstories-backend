import { AdminLogService } from '../services/admin-log.service';
import { PaginationQuery } from '../../../common/helpers/pagination.helper';
export declare class AdminLogsController {
    private adminLogService;
    constructor(adminLogService: AdminLogService);
    getAdminLogs(pagination: PaginationQuery, admin: string, module: string, action: string, dateFrom: string, dateTo: string): Promise<import("../../../common/helpers/pagination.helper").PaginationResult<unknown>>;
}
