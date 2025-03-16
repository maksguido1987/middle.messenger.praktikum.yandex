import "./style.scss";

export const Avatar = `
    <div class="avatar {{class}} {{#if size}}avatar--{{size}}{{/if}}"{{#if src}}style="background-image: url('{{src}}');"{{/if}}>
        {{#unless src}}
            {{#if initials}}
                <span class="avatar__initials">{{initials}}</span>
            {{/if}}
        {{/unless}}
    </div>
`;
