import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {DataLayerService} from '../../../shared/services/data-layer.service';

@Component({
    selector: 'app-input-mask',
    templateUrl: './input-mask.component.html',
    styleUrls: ['./input-mask.component.scss']
})
export class InputMaskComponent implements OnInit {
    formMask: FormGroup;
    scripts: any[] = [];
    cronSchedule: string;
    selectedScriptId: number;
    configName: string;
    isActive: Boolean = true;


    constructor(private fb: FormBuilder,
    private http: HttpClient,
    private dataLayerService: DataLayerService) { }

    ngOnInit() {
        this.formMask = this.fb.group({
            configName: [''],
            selectedScriptId: [''],
            cronSchedule: [''],
            isActive: [true]
        });

        this.dataLayerService.getScripts().subscribe(data => {
            this.scripts = data;
        });
    }
    submit() {
        if (this.formMask.valid) {
            const formData = new FormData();
            formData.append('name', this.formMask.value.configName);
            formData.append('script', this.formMask.value.selectedScriptId);
            formData.append('cron_schedule', this.formMask.value.cronSchedule);
            formData.append('is_active', this.formMask.value.isActive);

            console.log('Submitting Task Configuration:', formData);
            this.dataLayerService.createTaskConfiguration(formData).subscribe(
                response => {
                    console.log('Success! Configuration Saved:', response);
                    alert('Configuration saved successfully!');
                }
            );
        } else {
            alert('Please fill all required fields.');
        }
    }

}
