module FileRouter
  class Configurable

    # Array of Hash describing configuration parameters, which will be used to generate the user interface
    # Parameters that should not be presented to the user should not be displayed here
    # The format of the Hash objects in this Array is as follows
    #
    #   field:        string,   specifies the key of the item in the configuration hash (mandatory)
    #   display_name: string,   specifies the display name of the item in the UI (defaults to the value of :name)
    #   type:         Class,    String, Boolean, etc... (defaults to :string)
    #   required:     boolean,  whether the field is mandatory (defaults to true)
    #   default:      Object,   default value of the field (defaults to Nil)
    def self.configuration_spec
      []
    end

    # Accepts a provider configuration Hash and returns an array of Hash describing field-level errors
    # The entries in this hash must be as follows
    #
    #   field:    field name
    #   message:  error/warning
    def self.validate_configuration(configuration)
      spec = self.configuration_spec
      errs = []

      # Check for missing required fields
      spec.select {|o| o.fetch(:required, false) and not o.include? :default} .each do |opt|
        unless configuration.include? opt[:field]
          errs << {
            field: opt[:field],
            message: "Missing required field #{opt[:field]}"
          }
        end
      end

      # Validate present fields
      spec.select {|o| configuration.include? o[:field]} .each do |opt|
        field = configuration[opt[:field]]
        unless field.is_a? opt[:type]
          errs << {
            field:    opt[:field],
            message:  "Expected a #{opt[:type].name} but got a #{field.class.name}"
          }
        end
      end

      errs.concat self._validate_configuration configuration
    end

    # You might want to override the function that auto-generates a Hash for the form generator,
    # To do so, define a method named _form_spec as below
    #
    #   def self._form_spec(values)
    #     { ... }
    #   end
    #
    # The values parameter will be passed a Hash containing pre-fill values, if applicable.
    # The keys in the hash will correspond to the configuration field names specified in
    # self.configuration_spec
    def self.form_spec(values)
      components = {
        nil       => 'string',
        String    => 'string',
        Boolean   => 'boolean',
        DateTime  => 'string',
        Float     => 'string',
        Integer   => 'integer'
      }

      if self.respond_to? :_form_spec
        self._form_spec
      else
        # Compile a list of required field names
        required_fields = self.configuration_spec.select {|s| s.fetch(:required, false)} .map {|s| s[:field]}
        field_list      = self.configuration_spec.map do |s|
          [s[:field], {
            type:     components[s.fetch(:type, String)],
            title:    s.fetch(:name, s[:field]),
            default:  s.fetch(:default, nil)
          }]
        end

        {
          type: 'object',
          required: required_fields,
          properties: Hash[*field_list.flatten]
        }
      end
    end

    protected

    def self._validate_configuration(configuration)
      []
    end
  end
end
