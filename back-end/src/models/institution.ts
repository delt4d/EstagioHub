export enum ClassPeriod {
    Morning = 'Morning',
    Afternoon = 'Afternoon',
    Evening = 'Evening',
}

export type AcademicClass = {
    id?: number;
    courseName: string; // nome do curso, ex: Administração, Nutrição, etc.
    classPeriod: ClassPeriod; // período em que a aula ocorre, ex: Manhã, Tarde, Noite
};
