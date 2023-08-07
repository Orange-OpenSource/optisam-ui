import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { updateValidity } from "./util/common.functions";

export class CustomValidators {
    static uniqueNominativeUsersEmail(checkRemainingGroupControls: boolean = true): ValidatorFn {
        checkRemainingGroupControls ??= true;
        return (control: AbstractControl): ValidationErrors | null => {
            const ownGroup: FormGroup = control?.parent as FormGroup;
            const hadError: boolean = ownGroup?.get('email')?.hasError('emailUnique');
            const formArray: FormArray = ownGroup?.parent as FormArray;
            const groupIndex = formArray?.controls?.indexOf(ownGroup) ?? null;

            if ((formArray?.length ?? 0) <= 1) return null;
            if (ownGroup.hasError('email')) return null;
            const uniqueSets: string[] = formArray.controls.reduce((set: string[], group: FormGroup, index: number) => {
                if (index === groupIndex) return set;
                set.push(`${group?.get('profile')?.value?.trim()?.toLowerCase()}|${group?.get('email')?.value?.trim()?.toLowerCase()}`);
                return set;
            }, [])

            const ownUniqueSet: string = `${ownGroup?.get('profile')?.value?.trim()?.toLowerCase()}|${ownGroup?.get('email')?.value?.trim()?.toLowerCase()}`;
            let indexOfGoodSet: number = uniqueSets.indexOf(ownUniqueSet);
            indexOfGoodSet = indexOfGoodSet >= groupIndex ? indexOfGoodSet + 1 : indexOfGoodSet;
            const matchedGroup: FormGroup = formArray?.controls?.[indexOfGoodSet] as FormGroup;
            const emailValid: boolean = Validators.email(ownGroup?.get('email')) === null;
            const requiredValid: boolean = Validators.required(ownGroup?.get('email')) === null;

            if (uniqueSets.includes(ownUniqueSet) && emailValid && requiredValid) return { emailUnique: { profile: matchedGroup?.get('profile')?.value } }
            if (checkRemainingGroupControls) {
                formArray?.controls.forEach((control: FormGroup, index: number) => {
                    const validateControl: any = this.uniqueNominativeUsersEmail(false)(control.get('email'));
                    const hasEmailUniqueError: boolean = !!control?.get('email')?.errors?.emailUnique;
                    const hasProfileUniqueError: boolean = !!control?.get('profile')?.errors?.profileUnique;
                    if (validateControl === null) {
                        hasEmailUniqueError && delete control.get('email').errors.emailUnique;
                        hasEmailUniqueError && control.get('email').updateValueAndValidity();
                        if (hasProfileUniqueError) {
                            delete control.get('profile').errors.profileUnique;
                            control.get('profile').updateValueAndValidity();
                        }

                    }
                })
            }
            return null;
        }
    }

    static uniqueNominativeUsersProfile(checkRemainingGroupControls: boolean = true): ValidatorFn {

        return (control: AbstractControl): ValidationErrors | null => {
            const ownGroup: FormGroup = control?.parent as FormGroup;
            const hadError: boolean = ownGroup?.get('profile')?.hasError('profileUnique');
            const formArray: FormArray = ownGroup?.parent as FormArray;
            const groupIndex = formArray?.controls?.indexOf(ownGroup) ?? null;

            if ((formArray?.length ?? 0) <= 1) return null;
            const uniqueSets: string[] = formArray.controls.reduce((set: string[], group: FormGroup, index: number) => {
                if (index === groupIndex) return set;
                set.push(`${group?.get('profile')?.value?.trim()?.toLowerCase()}|${group?.get('email')?.value?.trim()?.toLowerCase()}`);
                return set;
            }, [])

            const ownUniqueSet: string = `${ownGroup?.get('profile')?.value?.trim()?.toLowerCase()}|${ownGroup?.get('email')?.value?.trim()?.toLowerCase()}`;
            let indexOfGoodSet: number = uniqueSets.indexOf(ownUniqueSet);
            indexOfGoodSet = indexOfGoodSet >= groupIndex ? indexOfGoodSet + 1 : indexOfGoodSet;
            const matchedGroup: FormGroup = formArray?.controls?.[indexOfGoodSet] as FormGroup;

            if (uniqueSets.includes(ownUniqueSet)) return { profileUnique: { email: matchedGroup?.get('email')?.value } }
            if (checkRemainingGroupControls) {
                formArray?.controls.forEach((control: FormGroup, index: number) => {
                    const validateControl: any = this.uniqueNominativeUsersProfile(false)(control.get('profile'));
                    const hasProfileUniqueError: boolean = !!control?.get('profile')?.errors?.profileUnique
                    const hasEmailUniqueError: boolean = !!control?.get('email')?.errors?.emailUnique
                    if (validateControl === null) {
                        hasProfileUniqueError && delete control.get('profile').errors.profileUnique
                        hasProfileUniqueError && control.get('profile').updateValueAndValidity();
                        if (hasEmailUniqueError) {
                            delete control.get('email').errors.emailUnique;
                            control.get('email').updateValueAndValidity();

                        }

                    }
                })
            }
            return null;
        }
    }
}