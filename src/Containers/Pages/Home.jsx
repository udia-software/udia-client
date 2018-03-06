import React from "react";
import styled from "styled-components";

export const Home = () => {
  document.title = "UDIA";

  const HomePageContainer = styled.div`
    grid-area: content;
    margin: 1em;
  `;

  return (
    <HomePageContainer>
      <p>
        This is the home page of the application. It's currently in development.
        Here is a bunch of raw HTML, pulled (and slightly modified) from{" "}
        <a href="https://github.com/ericrasch/html-kitchen-sink">
          ericrasch/html-kitchen-sink
        </a>.
      </p>
      <div id="wrapper">
        <h1>
          Kitchen Sink (Dev)
        </h1>
        <p>
          A small paragraph to <em>emphasis</em> and show{" "}
          <strong>important</strong> bits.
        </p>
        <ul>
          <li>This is a list item</li>
          <li>So is this - there could be more</li>
          <li>
            Make sure to style list items to:
            <ul>
              <li>Not forgetting child list items</li>
              <li>Not forgetting child list items</li>
              <li>Not forgetting child list items</li>
              <li>Not forgetting child list items</li>
            </ul>
          </li>
          <li>A couple more</li>
          <li>top level list items</li>
        </ul>
        <p>
          Don't forget <strong>Ordered lists</strong>:
        </p>
        <ol>
          <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
          <li>
            Aliquam tincidunt mauris eu risus.
            <ol>
              <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
              <li>Aliquam tincidunt mauris eu risus.</li>
            </ol>
          </li>
          <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
          <li>Aliquam tincidunt mauris eu risus.</li>
        </ol>
        <h2>
          A sub heading which is not as important as the first, but is quite
          imporant overall
        </h2>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo.
        </p>
        <table
          className="t1"
          summary="Top 10 downloaded movies in 2011 using BitTorrent, in descending order, listing number of downloads and worldwide cinema grosses"
        >
          <caption>Most Downloaded Movies on BitTorrent, 2011</caption>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Movie</th>
              <th>Downloads</th>
              <th>Grosses</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th colSpan="4">torrentfreak.com</th>
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <th>1</th>
              <td>Fast Five</td>
              <td>9,260,000</td>
              <td>$626,137,675</td>
            </tr>
            <tr>
              <th>2</th>
              <td>The Hangover II</td>
              <td>8,840,000</td>
              <td>$581,464,305</td>
            </tr>
            <tr>
              <th>3</th>
              <td>Thor</td>
              <td>8,330,000</td>
              <td>$449,326,618</td>
            </tr>
            <tr>
              <th>4</th>
              <td>Source Code</td>
              <td>7,910,000</td>
              <td>$123,278,618</td>
            </tr>
            <tr>
              <th>5</th>
              <td>I Am Number Four</td>
              <td>7,670,000</td>
              <td>$144,500,437</td>
            </tr>
            <tr>
              <th>6</th>
              <td>Sucker Punch</td>
              <td>7,200,000</td>
              <td>$89,792,502</td>
            </tr>
            <tr>
              <th>7</th>
              <td>127 Hours</td>
              <td>6,910,000</td>
              <td>$60,738,797</td>
            </tr>
            <tr>
              <th>8</th>
              <td>Rango</td>
              <td>6,480,000</td>
              <td>$245,155,348</td>
            </tr>
            <tr>
              <th>9</th>
              <td>The King’s Speech</td>
              <td>6,250,000</td>
              <td>$414,211,549</td>
            </tr>
            <tr>
              <th>10</th>
              <td>Harry Potter and the Deathly Hallows Part 2</td>
              <td>6,030,000</td>
              <td>$1,328,111,219</td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <th>Table Heading</th>
              <th>Table Heading</th>
            </tr>
            <tr>
              <td>table data</td>
              <td>table data</td>
            </tr>
            <tr>
              <td>table data</td>
              <td>table data</td>
            </tr>
            <tr>
              <td>table data</td>
              <td>table data</td>
            </tr>
            <tr>
              <td>table data</td>
              <td>table data</td>
            </tr>
          </tbody>
        </table>
        <h3>
          A sub heading which is not as important as the second, but should be
          used with consideration
        </h3>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo.
        </p>
        <blockquote>
          <p>
            <em>This is a properly formatted blockquote, btw.</em> Measuring
            programming progress by lines of code is like measuring aircraft
            building progress by weight.
          </p>
          <footer>
            —{" "}
            <cite>
              <a href="http://www.thegatesnotes.com">Bill Gates</a>
            </cite>
          </footer>
        </blockquote>
        <h4>
          A sub heading which is not as important as the second, but should be
          used with consideration
        </h4>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo.
        </p>
        <blockquote>
          <p>
            “Ooh - a blockquote! Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue.
            Ut a est eget ligula molestie gravida. Curabitur massa. Donec
            eleifend, libero at sagittis mollis, tellus est malesuada tellus, at
            luctus turpis elit sit amet quam. Vivamus pretium ornare est.”
          </p>
        </blockquote>
        <pre>
          <code>foobar();</code>
        </pre>
        <h5>
          A sub heading which is not as important as the second, but should be
          used with consideration
        </h5>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo.
        </p>
        <dl>
          <dt>Definition list</dt>
          <dd>
            Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </dd>
          <dt>Lorem ipsum dolor sit amet</dt>
          <dd>
            Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </dd>
        </dl>
        <h6>
          This heading plays a relatively small bit part role, if you use it at
          all
        </h6>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo.
        </p>
        <h1>Level 1 heading</h1>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h1 className="fancy">Level 1 heading className="fancy"</h1>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h1 className="thin">Level 1 heading className="thin"</h1>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h1 className="caps">Level 1 heading className="caps"</h1>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h2>Level 02 Heading</h2>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h2 className="fancy">Level 2 heading className="fancy"</h2>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h2 className="thin">Level 2 heading className="thin"</h2>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h2 className="caps">Level 2 heading className="caps"</h2>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h3>Level 03 Heading</h3>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h3 className="fancy">Level 3 heading className="fancy"</h3>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h3 className="thin">Level 3 heading className="thin"</h3>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h3 className="caps">Level 3 heading className="caps"</h3>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h4>Level 04 Heading</h4>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h4 className="fancy">Level 4 heading className="fancy"</h4>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h4 className="thin">Level 4 heading className="thin"</h4>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h4 className="caps">Level 4 heading className="caps"</h4>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h5>Level 05 Heading</h5>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h5 className="fancy">Level 5 heading className="fancy"</h5>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h5 className="thin">Level 5 heading className="thin"</h5>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h5 className="caps">Level 5 heading className="caps"</h5>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h6>Level 06 Heading</h6>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h6 className="fancy">Level 6 heading className="fancy"</h6>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h6 className="thin">Level 6 heading className="thin"</h6>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <h6 className="caps">Level 6 heading className="caps"</h6>
        <p>
          Sed scelerisque sagittis lorem. Phasellus sodales. Nulla urna justo,
          vehicula in, suscipit nec, molestie sed, tellus.
        </p>
        <blockquote>
          <p>
            Paragraph inside Blockquote: Nam libero leo, elementum in, dapibus
            a, suscipit vitae, purus. Duis arcu. Integer dignissim fermentum
            enim. Morbi convallis felis vel nibh. Sed scelerisque sagittis
            lorem.
          </p>
        </blockquote>
        <address>Address: Example address 224, Sweden</address>
        <pre>
          <strong>Preformated:</strong>Testing one row and another
        </pre>
        <p>
          I am <a href="?abc123">the a tag</a> example<br />
          I am <abbr title="test">the abbr tag</abbr> example<br />
          I am <acronym>the acronym tag</acronym> example<br />
          I am <b>the b tag</b> example<br />
          I am <big>the big tag</big> example<br />
          I am <cite>the cite tag</cite> example<br />
          I am <code>the code tag</code> example<br />
          I am <del>the del tag</del> example<br />
          I am <dfn>the dfn tag</dfn> example<br />
          I am <em>the em tag</em> example<br />
          I am <i>the i tag</i> example<br />
          I am <ins>the ins tag</ins> example<br />
          I am <kbd>the kbd tag</kbd> example<br />
          I am <q>the q tag</q> example<br />
          I am <samp>the samp tag</samp> example<br />
          I am <small>the small tag</small> example<br />
          I am <span>the span tag</span> example<br />
          I am <strong>the strong tag</strong> example<br />
          I am <sub>the sub tag</sub> example<br />
          I am <sup>the sup tag</sup> example<br />
          I am <tt>the tt tag</tt> example<br />
          I am <var>the var tag</var> example<br />
          I am the <span className="small">small class</span> example<br />
          I am the <span className="large">large class</span> example<br />
          I am the <span className="quiet">quiet class</span> example<br />
          I am the <span className="highlight">
            highlight class
          </span> example<br />
        </p>
        <hr />
        <ul>
          <li>Unordered list 01</li>
          <li>Unordered list 02</li>
          <li>
            Unordered list 03
            <ul>
              <li>Unordered list inside list level 2</li>
              <li>
                Unordered list inside list level 2
                <ul>
                  <li>Unordered list inside list level 3</li>
                  <li>Unordered list inside list level 3</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <ol>
          <li>Ordered list 01</li>
          <li>Ordered list 02</li>
          <li>
            Ordered list 03
            <ol>
              <li>Ordered list inside list level 2</li>
              <li>
                Ordered list inside list level 2
                <ol>
                  <li>Ordered list inside list level 3</li>
                  <li>Ordered list inside list level 3</li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>
        <dl>
          <dt>Description list title 01</dt>
          <dd>Description list description 01</dd>
          <dt>Description list title 02</dt>
          <dd>Description list description 02</dd>
          <dd>Description list description 03</dd>
        </dl>
        <table>
          <caption>Table Caption</caption>
          <thead>
            <tr>
              <th>Table head th</th>
              <td>Table head td</td>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>Table foot th</th>
              <td>Table foot td</td>
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <th>Table body th</th>
              <td>Table body td</td>
            </tr>
            <tr>
              <td>Table body td</td>
              <td>Table body td</td>
            </tr>
          </tbody>
        </table>
        <form action="#">
          <fieldset>
            <legend>Form legend</legend>
            <div>
              <label htmlFor="f1">Text input:</label>
              <input type="text" id="f1" defaultValue="input text" />
            </div>
            <div>
              <label htmlFor="pw">Password input:</label>
              <input type="password" id="pw" defaultValue="password" />
            </div>
            <div>
              <label htmlFor="f2">Radio input:</label>
              <input type="radio" id="f2" />
            </div>
            <div>
              <label htmlFor="f3">Checkbox input:</label>
              <input type="checkbox" id="f3" />
            </div>
            <div>
              <label htmlFor="f4">Select field:</label>
              <select id="f4">
                <option>Option 01</option>
                <option>Option 02</option>
              </select>
            </div>
            <div>
              <label htmlFor="f5">Textarea:</label>
              <textarea
                id="f5"
                cols="30"
                rows="5"
                defaultValue="Textarea text"
              />
            </div>
            <div>
              <label htmlFor="f6">Input Button:</label>
              <input type="button" id="f6" defaultValue="button text" />
            </div>
            <div>
              <label>
                Button Elements:{" "}
                <span className="small quiet">
                  Can use &lt;button&gt; tag or &lt;a className="button"&gt;
                </span>
              </label>
              <button className="button positive">
                <img
                  src="https://raw.githubusercontent.com/ericrasch/html-kitchen-sink/master/web/assets/img/icons/tick.png"
                  alt=""
                />{" "}
                Save
              </button>
              <a className="button" href="/">
                <img
                  src="https://raw.githubusercontent.com/ericrasch/html-kitchen-sink/master/web/assets/img/icons/key.png"
                  alt=""
                />
                Change Password
              </a>{" "}
              <a href="/" className="button negative">
                <img
                  src="https://raw.githubusercontent.com/ericrasch/html-kitchen-sink/master/web/assets/img/icons/cross.png"
                  alt=""
                />{" "}
                Cancel
              </a>
            </div>
          </fieldset>
        </form>
        I am <a href="something.doc">a word document</a> link, so readers know
        that I'm not a normal link.<br />
        I am <a href="something.pdf">a pdf document</a> link, so readers know
        that I'm not a normal link.<br />
        I am <a href="http://www.something.com">an external website</a> link, so
        readers know that I'm not a normal link.<br />
        I am <a href="something.rss">an rss feed</a> link, so readers know that
        I'm not a normal link.<br />
        I am <a href="something.xls">an excel spreadsheet</a> link, so readers
        know that I'm not a normal link.<br />
        I am <a href="aim:something">an AIM screenname</a> link, so readers know
        that I'm not a normal link.<br />
        I am <a href="mailto:something">an email address</a> link, so readers
        know that I'm not a normal link.<br />
        I am <a href="http://yourwebsite.com">an internal link</a>. Change the
        stylesheet's "http://yourwebsite.com" to your domain name so I don't
        look like an external link.<br />
        <br />
        <p className="success">
          <img
            src="https://raw.githubusercontent.com/ericrasch/html-kitchen-sink/master/web/assets/img/icons/tick.png"
            alt=""
          />{" "}
          This is a paragraph with className="success" and{" "}
          <a href="http://www.something.com">a link</a>.
        </p>
        <p className="error">
          <img
            src="https://raw.githubusercontent.com/ericrasch/html-kitchen-sink/master/web/assets/img/icons/cross.png"
            alt=""
          />{" "}
          This is a paragraph with className="error" and{" "}
          <a href="http://www.something.com">a link</a>.
        </p>
        <p className="notice">
          <img
            src="https://raw.githubusercontent.com/ericrasch/html-kitchen-sink/master/web/assets/img/icons/information.png"
            alt=""
          />{" "}
          This is a paragraph with className="notice" and{" "}
          <a href="http://www.something.com">a link</a>.
        </p>
      </div>
    </HomePageContainer>
  );
};

export default Home;
