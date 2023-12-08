package frontend

import org.scalajs.dom
import com.raquo.laminar.api.L.*
import com.raquo.laminar.codecs.AsIsCodec
import com.raquo.laminar.nodes.*
import com.raquo.laminar.keys.*
import com.raquo.laminar.tags.*

object Embed:
  type Ref = dom.html.Element
  val tag: HtmlTag[Ref] = htmlTag("demo-embedded")

  def apply(mods: Mod[ReactiveHtmlElement[Ref]]*) =
    tag(mods)

object Container:
  type Ref = dom.html.Element
  val tag: HtmlTag[Ref] = htmlTag("demo-container")

  def apply(mods: Mod[ReactiveHtmlElement[Ref]]*) =
    tag(mods)


@main
def main =

  val app = div(
    Container(
      cls := "custom-class scala",
      // htmlProp("name", AsIsCodec()) := "name",
      htmlProp("name", AsIsCodec()) <-- Signal.fromValue("name from signal"),
      child <-- EventStream.periodic(1000).map(n => div(cls:= "test scala", slot := "header", f"Counter $n")),
      child <-- Val(div(cls:= "test2 scala", slot := "header", "Fill the header (also)")),
      child <-- Val(Embed()),
      // child <-- Val(div("try me")),
      child <-- Val(div(cls:= "scala", slot := "footer", "Fill the footer"))
    )
  )
  renderOnDomContentLoaded(dom.document.querySelector("#app"), app)
