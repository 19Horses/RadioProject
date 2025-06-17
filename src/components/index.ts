import {IInputs, IOutputs} from "./generated/ManifestTypes";
import Inputmask from "inputmask";

export class MaskedInput implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _inputElement: HTMLInputElement;
    private _value: string;
    private _notifyOutputChanged: () => void;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;

        this._inputElement = document.createElement("input");
        this._inputElement.type = "text";
        this._inputElement.className = "masked-input";

        // Optional: Apply phone number mask (UK format)
        Inputmask({"mask": "+44 9999 999999"}).mask(this._inputElement);

        this._inputElement.addEventListener("input", () => {
            this._value = this._inputElement.value;
            this._notifyOutputChanged();
        });

        this._container.appendChild(this._inputElement);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const newValue = context.parameters.sampleProperty.raw || "";
        if (this._inputElement.value !== newValue) {
            this._inputElement.value = newValue;
        }
    }

    public getOutputs(): IOutputs {
        return {
            sampleProperty: this._value
        };
    }

    public destroy(): void {
        // Clean up
    }
}
