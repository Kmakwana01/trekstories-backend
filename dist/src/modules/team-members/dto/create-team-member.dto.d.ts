export declare class SocialLinksDto {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
}
export declare class CreateTeamMemberDto {
    name: string;
    designation: string;
    bio?: string;
    image?: string;
    socialLinks?: SocialLinksDto;
    order?: number;
    isActive?: boolean;
}
