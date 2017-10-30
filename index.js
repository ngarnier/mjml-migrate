import migrate from './src/migrate'

const mjml4 = migrate(`<mjml>
<mj-body>
  <mj-container>
    <mj-section>
      <mj-column>
        <mj-text font-size="10">Hello</mj-text>
        <mj-social mode="vertical" display="google facebook" google-icon-color="#424242" facebook-icon-color="#424242" facebook-href="My facebook page" google-href="My google+ page" />
      </mj-column>
    </mj-section>
  </mj-container>
</mj-body>
</mjml>`)

console.log(mjml4)