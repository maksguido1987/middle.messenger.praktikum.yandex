import "./Input.scss";

export const Input = `
    <div class="input-container">
        <input class="input {{class}}" type="{{type}}" id="{{id}}" name="{{name}}" value="{{value}}" placeholder=" " {{#if required}}required{{/if}}>
        <label class="input-label" for="{{id}}">{{label}}</label>
        <div class="input-underline"></div>
        {{#if error}}
        <div class="input-error">{{error}}</div>
        {{/if}}
    </div>
`;
