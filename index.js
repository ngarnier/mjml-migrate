import migrate from './src/migrate'

let mjml4 = migrate(`<mjml>
<mj-body>
  <mj-container>
    <mj-section>
      <mj-column>
        <mj-text font-size="10">Hello</mj-text>
        <mj-social mode="vertical" display="google facebook" google-icon-color="#424242" facebook-icon-color="#424242" facebook-href="My facebook page" google-href="My google+ page" />
        <mj-social display="facebook awesome-network" awesome-network-content="Share on a awesome network" awesome-network-href="http://awesome-network.com/my-company" awesome-network-icon-color="#FF00FF" awesome-network-icon="http://myicon.png" />
      </mj-column>
    </mj-section>
  </mj-container>
</mj-body>
</mjml>`)

console.log(mjml4)