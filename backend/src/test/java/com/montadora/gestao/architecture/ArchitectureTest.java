package com.montadora.gestao.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.fields;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noFields;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;

import com.tngtech.archunit.core.domain.JavaModifier;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(packages = "com.montadora.gestao", importOptions = ImportOption.DoNotIncludeTests.class)
public class ArchitectureTest {

    @ArchTest
    static final ArchRule services_should_not_depend_on_web =
            noClasses()
                    .that().resideInAPackage("..service..")
                    .should().dependOnClassesThat().resideInAnyPackage(
                            "..controller..",
                            "org.springframework.web..",
                            "org.springframework.http.ResponseEntity",
                            "org.springframework.http.HttpStatus"
                    )
                    .because("Services must remain decoupled from HTTP/Web concerns");

    @ArchTest
    static final ArchRule controllers_should_not_depend_on_repositories =
            noClasses()
                    .that().resideInAPackage("..controller..")
                    .should().dependOnClassesThat().resideInAPackage("..repository..")
                    .because("Controllers must only orchestrate through services, never access repositories directly");

    @ArchTest
    static final ArchRule repositories_should_not_depend_on_services_or_controllers =
            noClasses()
                    .that().resideInAPackage("..repository..")
                    .should().dependOnClassesThat().resideInAnyPackage("..service..", "..controller..")
                    .because("Repositories are data access components and must not depend on higher layers");

    @ArchTest
    static final ArchRule domain_should_not_depend_on_dto_or_web =
            noClasses()
                    .that().resideInAPackage("..domain..")
                    .should().dependOnClassesThat().resideInAnyPackage("..dto..", "..controller..", "org.springframework.web..")
                    .because("Domain entities must not leak into or know about DTOs or Web layers");

    @ArchTest
    static final ArchRule no_field_injection =
            noFields()
                    .should().beAnnotatedWith(Autowired.class)
                    .because("Constructor injection must be used for all dependencies");

    @ArchTest
    static final ArchRule no_lombok_allowed =
            noClasses()
                    .should().dependOnClassesThat().resideInAPackage("lombok..")
                    .because("Lombok bytecode generation is forbidden in this project");

    @ArchTest
    static final ArchRule mappers_must_be_final =
            classes()
                    .that().haveSimpleNameEndingWith("Mapper")
                    .should().haveModifier(JavaModifier.FINAL)
                    .because("Utility mappers must be final utility classes");

    @ArchTest
    static final ArchRule mappers_must_have_private_constructors =
            classes()
                    .that().haveSimpleNameEndingWith("Mapper")
                    .should().haveOnlyPrivateConstructors()
                    .because("Utility mappers must not be instantiable");

    @ArchTest
    static final ArchRule money_is_not_floating_point =
            fields()
                    .that().haveName("price")
                    .and().areDeclaredInClassesThat().resideInAPackage("..domain..")
                    .should().haveRawType(BigDecimal.class)
                    .because("Financial and money attributes must use BigDecimal, never double or float");
}
