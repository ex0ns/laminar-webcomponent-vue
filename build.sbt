import org.scalajs.linker.interface.ModuleSplitStyle

lazy val frontend = project.in(file("frontend")).settings(
  scalaVersion := "3.3.1",
  libraryDependencies ++= Seq(
    "org.scala-js" %%% "scalajs-dom" % "2.4.0",
    "com.raquo" %%% "laminar" % "16.0.0",

  ),
  scalaJSLinkerConfig ~= {
    _.withModuleKind(ModuleKind.ESModule)
      .withModuleSplitStyle(ModuleSplitStyle.SmallModulesFor(List("frontend")))
  },
  scalaJSUseMainModuleInitializer := true
).enablePlugins(ScalaJSPlugin)
